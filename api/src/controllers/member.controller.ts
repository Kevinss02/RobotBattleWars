/* eslint-disable @typescript-eslint/naming-convention */
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

import { ADMIN_TOKEN } from '../config.js';
import { Member } from '../entities/member.entity.js';
import { Team } from '../entities/team.entity.js';
import { createAccessToken } from '../libs/jwt.js';
import {
  memberSchema,
  optionalMemberSchema,
} from '../schemas/member.schema.js';
import {
  MemberFilters,
  MemberResponse,
  MemberType,
  RequestWithUser,
} from '../utils/types/types.js';

export const getMembers = async function (
  req: RequestWithUser,
  res: Response,
): Promise<void> {
  try {
    const { active, dni, fullname, email, is_captain, team_id } = req.query;

    const { user } = req;

    if (user?.id == null || user?.isAdmin == null) {
      throw new Error('Valid token header is needed to authenticate');
    }

    const filters: MemberFilters = {};

    if (active !== undefined) {
      filters.active = active === 'true';
    }

    if (dni !== undefined) {
      filters.dni = dni as string;

      if (filters.dni !== user.id && user?.isAdmin === false) {
        res
          .status(403)
          .json({ message: 'Forbidden: Cannot access private data' });
        return;
      }
    } else {
      filters.dni = user?.isAdmin === true ? undefined : user.id;
    }

    if (fullname !== undefined) {
      filters.fullname = fullname as string;
    }

    if (email !== undefined) {
      filters.email = email as string;
    }

    if (is_captain !== undefined) {
      filters.is_captain = is_captain === 'true';
    }

    if (team_id !== undefined) {
      filters.team_id = parseInt(team_id as string);
    }

    const members: MemberResponse[] = await Member.find({
      where: filters,
      relations: ['team_id'],
    });

    if (members.length > 0) {
      res.status(200).json({ members });
    } else {
      res.status(404).json({ error: 'Members not found' });
    }
  } catch (error) {
    console.error('Error while retrieving members:', error);

    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const registerMember = async function (
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const validatedMember = memberSchema.parse(req.body);

    const adminToken = req.headers.token;

    const { dni, fullname, email, is_captain, team_id, password }: MemberType =
      validatedMember;

    const passwordHash = await bcrypt.hash(password, 10);

    const member = new Member();

    const existingMember = await Member.findOneBy({ dni });

    if (existingMember != null) {
      res
        .status(400)
        .json({ error: 'A member with the same dni already exists' });

      return;
    }

    member.dni = dni;
    member.fullname = fullname;
    member.email = email;
    member.is_captain = is_captain;
    member.active = true;
    member.password = passwordHash;

    if (team_id !== undefined) {
      const team = await Team.findOneBy({ team_id });

      if (team == null) {
        res.status(400).json({ error: 'Team id not found' });
        return;
      }
      member.team_id = team;
    }

    await member.save();

    if (adminToken !== undefined && adminToken === ADMIN_TOKEN) {
      console.log('ADMIN REGISTERED');
    }

    const token =
      adminToken !== undefined && adminToken === ADMIN_TOKEN
        ? await createAccessToken({ id: member.dni, isAdmin: true })
        : await createAccessToken({ id: member.dni, isAdmin: false });

    res.status(201).json({ registered: member, token });
  } catch (error) {
    console.error('Error while registering member:', error);

    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const deleteMember = async function (
  req: RequestWithUser,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    if (id == null) {
      res.status(400).json({ error: 'Parameter "id" is required' });
    }

    const { user } = req;

    if (user?.id == null || user?.isAdmin == null) {
      throw new Error('Valid token header is needed to authenticate');
    }

    if (id !== user.id && user?.isAdmin === false) {
      res
        .status(403)
        .json({ message: 'Forbidden: Cannot delete private data' });
      return;
    }

    const result = await Member.delete({ dni: id });

    if (result.affected === 0) {
      res.status(404).json({ message: 'Member not found' });
    }

    res.status(204).json('Succesful detele');
  } catch (error) {
    console.error('Error while deleting member:', error);

    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const updateMember = async function (
  req: RequestWithUser,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    if (id == null) {
      res.status(400).json({ error: 'Parameter "id" is required' });
      return;
    }
    const { user } = req;

    if (user?.id == null || user?.isAdmin == null) {
      throw new Error('Valid token header is needed to authenticate');
    }

    if (id !== user.id && user?.isAdmin === false) {
      res
        .status(403)
        .json({ message: 'Forbidden: Cannot update private data' });
      return;
    }

    const existingMember = await Member.findOne({
      where: {
        dni: id,
      },
    });

    if (existingMember == null) {
      res.status(404).json({ error: 'Member not found' });
      return;
    }

    const updatedMemberData = optionalMemberSchema.parse(req.body);
    const { dni, fullname, email, is_captain, active, team_id }: MemberFilters =
      updatedMemberData;

    const nonNullAttributes = Object.fromEntries(
      Object.entries({
        dni,
        fullname,
        email,
        is_captain,
        active,
      }).filter(([_, value]) => value !== null && value !== undefined),
    );

    Object.assign(existingMember, nonNullAttributes);

    if (team_id !== undefined) {
      const team = await Team.findOneBy({ team_id });

      if (team == null) {
        res.status(400).json({ error: 'Team id not found' });
        return;
      }

      existingMember.team_id = team;
    }

    await existingMember.save();
    res.status(200).json({ updated: existingMember });
  } catch (error) {
    console.error('Error while updating member:', error);

    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
