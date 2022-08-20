import { Point } from '../../../shapes';
import { EntityId } from '../../entity/types/index';

type EntityConfig = {
  type:EntityId
  position:Point
};

export default EntityConfig;
