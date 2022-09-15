import { Entity, EntityClass, EntityId } from '.';
import Placeholder from './Placeholder';

const entitiesList:Record<EntityId, EntityClass<Entity>> = {
  [EntityId.Placeholder]: Placeholder,
};

export default entitiesList;
