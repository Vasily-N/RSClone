import Entity from '.';
import EntityClass from './classType';
import EntityId from './entityIds';
import Placeholder from './Placeholder';

const entitiesList:Record<EntityId, EntityClass<Entity>> = {
  [EntityId.Placeholder]: Placeholder,
};

export default entitiesList;
