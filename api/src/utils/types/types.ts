import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { z } from 'zod';

import { ROBOT_CATEGORY } from '../../config.js';
import { battleSchema } from '../../schemas/battle.schema.js';
import { battleKindSchema } from '../../schemas/battlekind.schema.js';
import { cutterSchema } from '../../schemas/cutter.schema.js';
import { flamethrowerSchema } from '../../schemas/flamethrower.schema.js';
import { hitterSchema } from '../../schemas/hitter.schema.js';
import { memberSchema } from '../../schemas/member.schema.js';
import { placeSchema } from '../../schemas/place.schema.js';
import { robotSchema } from '../../schemas/robot.schema.js';
import { teamSchema } from '../../schemas/team.schema.js';

export type PlaceType = z.infer<typeof placeSchema>;
export type MemberType = z.infer<typeof memberSchema>;
export type TeamType = z.infer<typeof teamSchema>;
export type RobotType = z.infer<typeof robotSchema>;
export type CutterType = z.infer<typeof cutterSchema>;
export type FlamethrowerType = z.infer<typeof flamethrowerSchema>;
export type HitterType = z.infer<typeof hitterSchema>;
export type BattleType = z.infer<typeof battleSchema>;
export type BattleKindType = z.infer<typeof battleKindSchema>;

export type MemberResponse = Omit<MemberType, 'team_id'> & {
  team?: TeamResponse;
  created_at?: Date;
  updated_at?: Date;
};

export type TeamResponse = Omit<TeamType, 'robot_id'> & {
  robot?: RobotResponse;
  created_at?: Date;
  updated_at?: Date;
};

export type BattleResponse = Omit<
  BattleType,
  'team_id1' | 'team_id2' | 'type_id' | 'place_id'
> & {
  type?: BattleKindType;
  place?: PlaceType;
  team1?: TeamResponse;
  team2?: TeamResponse;
};

export type RobotResponse = RobotType & {
  created_at?: Date;
  updated_at?: Date;
};

export type PlaceResponse = PlaceType;

export type HerentialResponse = Omit<HitterType, 'robot_id'> & {
  robot?: RobotResponse;
};

export type BattleKindFilters = Partial<BattleKindType>;

export type PlaceFilters = Partial<PlaceType>;

export type MemberFilters = Partial<MemberType>;

export type TeamFilters = Partial<TeamType>;

export type RobotFilters = Partial<RobotType>;

export type CutterFilters = Partial<CutterType>;

export type HitterFilters = Partial<HitterType>;

export type FlamethrowerFilters = Partial<FlamethrowerType>;

export type BattleFilters = Partial<BattleType>;

export type RequestWithUser = Request & {
  user?: jwt.JwtPayload;
};

export type RobotCategory = (typeof ROBOT_CATEGORY)[number];
