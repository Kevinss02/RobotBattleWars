/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Response } from 'express';

import { ROBOT_CATEGORY } from '../config.js';
import { Cutter } from '../entities/cutter.entity.js';
import { Flamethrower } from '../entities/flamethrower.entity.js';
import { Hitter } from '../entities/hitter.entity.js';
import { Robot } from '../entities/robot.entity.js';
import {
  cutterSchema,
  optionalCutterSchema,
} from '../schemas/cutter.schema.js';
import {
  flamethrowerSchema,
  optionalFlamethrowerSchema,
} from '../schemas/flamethrower.schema.js';
import {
  hitterSchema,
  optionalHitterSchema,
} from '../schemas/hitter.schema.js';
import { optionalRobotSchema, robotSchema } from '../schemas/robot.schema.js';
import {
  CutterFilters,
  CutterType,
  FlamethrowerFilters,
  FlamethrowerType,
  HitterFilters,
  HitterType,
  RobotCategory,
  RobotFilters,
  RobotType,
} from '../utils/types/types.js';

function isValidRobotCategory(value: any): value is RobotCategory {
  return ROBOT_CATEGORY.includes(value);
}

export const getRobots = async function (
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { robot_id, name, mobility, power, coating, cost, category } =
      req.query;

    const filters: RobotFilters = {};

    if (robot_id !== undefined) {
      filters.robot_id = parseInt(robot_id as string);
    }

    if (mobility !== undefined) {
      filters.mobility = parseInt(mobility as string);
    }

    if (power !== undefined) {
      filters.power = parseInt(power as string);
    }

    if (name !== undefined) {
      filters.name = name as string;
    }

    if (coating !== undefined) {
      filters.coating = parseInt(coating as string);
    }

    if (cost !== undefined) {
      filters.cost = parseFloat(cost as string);
    }

    if (category !== undefined) {
      if (!isValidRobotCategory(category)) {
        res.status(400).json({ error: 'Invalid category parameter' });
      } else {
        filters.category = category;
      }
    }

    const robots = await Robot.find({
      where: filters,
    });

    if (robots.length > 0) {
      res.status(200).json({ robots });
    } else {
      res.status(404).json({ error: 'Robots not found' });
    }
  } catch (error) {
    console.error('Error while retrieving robots:', error);

    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const registerRobot = async function (
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const validatedRobot = robotSchema.parse(req.body);

    const { name, mobility, power, coating, cost, category }: RobotType =
      validatedRobot;

    const robot = new Robot();

    const existingRobot = await Robot.findOneBy({ name });

    if (existingRobot != null) {
      res
        .status(400)
        .json({ error: 'A robot with the same name already exists' });

      return;
    }

    robot.name = name;
    robot.mobility = mobility;
    robot.power = power;
    robot.coating = coating;
    robot.cost = cost;

    // Propiedades específicas de Cutter
    if (category === 'Cutter') {
      const { rpm, saw_material, saw_count }: CutterType = req.body;
      const validatedRobotCutter = cutterSchema.parse({
        rpm,
        saw_material,
        saw_count,
      });

      const cutterRobot = new Cutter();
      Object.assign(cutterRobot, robot);

      cutterRobot.category = 'Cutter';
      cutterRobot.rpm = validatedRobotCutter.rpm;
      cutterRobot.saw_material = validatedRobotCutter.saw_material;
      cutterRobot.saw_count = validatedRobotCutter.saw_count;

      await cutterRobot.save();
      res.status(201).json({ registered: cutterRobot });
    } else if (category === 'Flamethrower') {
      // Propiedades específicas de Flamethrower
      const { fuel, max_temperature, spitfire_count }: FlamethrowerType =
        req.body;
      const validatedRobotFlamethrower = flamethrowerSchema.parse({
        fuel,
        max_temperature,
        spitfire_count,
      });

      const flamethrowerRobot = new Flamethrower();
      Object.assign(flamethrowerRobot, robot);

      flamethrowerRobot.category = 'Flamethrower';
      flamethrowerRobot.fuel = validatedRobotFlamethrower.fuel;
      flamethrowerRobot.max_temperature =
        validatedRobotFlamethrower.max_temperature;
      flamethrowerRobot.spitfire_count =
        validatedRobotFlamethrower.spitfire_count;

      await flamethrowerRobot.save();
      res.status(201).json({ registered: flamethrowerRobot });
    } else if (category === 'Hitter') {
      // Propiedades específicas de Hitter
      const {
        arm_material,
        joint_count,
        hitting_surface,
        hitting_force,
      }: HitterType = req.body;
      const validatedRobotHitter = hitterSchema.parse({
        arm_material,
        joint_count,
        hitting_surface,
        hitting_force,
      });

      const hitterRobot = new Hitter();
      Object.assign(hitterRobot, robot);

      hitterRobot.category = 'Hitter';
      hitterRobot.arm_material = validatedRobotHitter.arm_material;
      hitterRobot.joint_count = validatedRobotHitter.joint_count;
      hitterRobot.hitting_surface = validatedRobotHitter.hitting_surface;
      hitterRobot.hitting_force = validatedRobotHitter.hitting_force;

      await hitterRobot.save();
      res.status(201).json({ registered: hitterRobot });
    } else {
      res.status(404).json({
        error: 'Invalid Category. Must be (Hitter | Cutter | Flamethrower)',
      });
    }
  } catch (error) {
    console.error('Error while registering robot:', error);

    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const deleteRobot = async function (
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    if (id == null) {
      res.status(400).json({ error: 'Parameter "id" is required' });
    }

    const result = await Robot.delete({ robot_id: parseInt(id) });

    if (result.affected === 0) {
      res.status(404).json({ error: 'Robot not found' });
      return;
    }

    res.status(204).json('Succesful detele');
  } catch (error) {
    console.error('Error while deleting robot:', error);

    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const updateRobot = async function (
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    if (id == null) {
      res.status(400).json({ error: 'Parameter "id" is required' });
      return;
    }

    const existingRobot = await Robot.findOne({
      where: {
        robot_id: parseInt(id),
      },
    });

    if (existingRobot == null) {
      res.status(404).json({ error: 'Robot not found' });
      return;
    }

    const validatedRobot = optionalRobotSchema.parse(req.body);

    const { name, mobility, power, coating, cost, category }: RobotFilters =
      validatedRobot;

    const nonNullAttributes = Object.fromEntries(
      Object.entries({ name, mobility, power, coating, cost, category }).filter(
        ([_, value]) => value !== null && value !== undefined,
      ),
    );

    Object.assign(existingRobot, nonNullAttributes);

    // Determina el tipo de robot y actualiza según corresponda
    if (existingRobot instanceof Cutter) {
      const { rpm, saw_material, saw_count }: CutterFilters = req.body;

      optionalCutterSchema.parse({
        rpm,
        saw_material,
        saw_count,
      });

      const nonNullCutterAttributes = Object.fromEntries(
        Object.entries({
          rpm,
          saw_material,
          saw_count,
        }).filter(([_, value]) => value !== null && value !== undefined),
      );

      Object.assign(existingRobot, nonNullCutterAttributes);
    } else if (existingRobot instanceof Flamethrower) {
      const { fuel, max_temperature, spitfire_count }: FlamethrowerFilters =
        req.body;

      optionalFlamethrowerSchema.parse({
        fuel,
        max_temperature,
        spitfire_count,
      });

      const nonNullFlameAttributes = Object.fromEntries(
        Object.entries({
          fuel,
          max_temperature,
          spitfire_count,
        }).filter(([_, value]) => value !== null && value !== undefined),
      );

      Object.assign(existingRobot, nonNullFlameAttributes);
    } else if (existingRobot instanceof Hitter) {
      const {
        arm_material,
        joint_count,
        hitting_surface,
        hitting_force,
      }: HitterFilters = req.body;

      optionalHitterSchema.parse({
        arm_material,
        joint_count,
        hitting_surface,
        hitting_force,
      });

      const nonNullHitterAttributes = Object.fromEntries(
        Object.entries({
          arm_material,
          joint_count,
          hitting_surface,
          hitting_force,
        }).filter(([_, value]) => value !== null && value !== undefined),
      );

      Object.assign(existingRobot, nonNullHitterAttributes);
    } else {
      res.status(400).json({
        error: 'Invalid Category. Must be (Hitter | Cutter | Flamethrower)',
      });
      return;
    }

    const result = await existingRobot.save();
    res.status(200).json({ updated: result });
  } catch (error) {
    console.error('Error while updating robot:', error);

    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
