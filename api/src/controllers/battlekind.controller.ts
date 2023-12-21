/* eslint-disable @typescript-eslint/naming-convention */
import { Response} from 'express';
// import { AppDataSource } from '../database/db.js';
import { BattleKind } from '../entities/battlekind.entity.js';
import {
  RequestWithUser,
 BattleKindFilters,
 BattleKindType
} from '../utils/types/types.js';

export const getBattleKinds = async function (
  req: RequestWithUser,
  res: Response,
): Promise<void> {
  try {
    const { type_id, rounds, time_per_round, timeouts, spontaneous } = req.query;
   // const { user } = req;
    const filters: BattleKindFilters = {};

    if (type_id !== undefined) {
        filters.type_id = parseInt(type_id as string);
    }

    if (rounds !== undefined) {
        filters.rounds = parseInt(rounds as string);
    }
    if (time_per_round !== undefined) {
        filters.time_per_round = parseInt(time_per_round as string);
    }

    if (timeouts !== undefined) {
        filters.timeouts = parseInt(timeouts as string);
    }
    if (spontaneous !== undefined) {
        if (spontaneous === "true" || spontaneous === "0" ) {
            filters.spontaneous = true;
        }
        if (spontaneous === "false" || spontaneous === "1") {
            filters.spontaneous = false;
        } else {
            res.status(404).json({ error: 'Spontaneous must be boolean' });
        }         
    }  
    
    const battlekinds: BattleKindType[] = await BattleKind.find({
      where: filters,
    });

    if (battlekinds.length > 0) {
      res.status(200).json(battlekinds);
    } else {
      res.status(404).json({ error: 'Battlekinds not found' });
    }
  } catch (error) {
    console.error('Error while retrieving battlekinds:', error);

    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const registerBattleKind = async function (
  req: RequestWithUser,
  res: Response,
): Promise<void> {
  try {
    const { rounds, time_per_round, timeouts, spontaneous } = req.body;
    const battlekind = new BattleKind();

    battlekind.rounds = rounds;
    battlekind.time_per_round = time_per_round;
    battlekind.timeouts = timeouts;
    battlekind.spontaneous = spontaneous;

    await battlekind.save();
    res.status(201).json(battlekind);
  } catch (error) {
    console.error('Error while registering battlekind:', error);

    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const deleteBattleKind = async function (
  req: RequestWithUser,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    if (id == null) {
      res.status(400).json({ error: 'Parameter "id" is required' });
      return;
    }

    const battlekind = await BattleKind.delete({ type_id: parseInt(id) });
  
    if (battlekind.affected === 0) {
      res.status(404).json({ message: 'Battlekind not found' });
      return;
    }

    res.status(204).json('Succesful detele');
  } catch (error) {
    console.error('Error while deleting battlekind:', error);

    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
