import Entity from '.';
import EntityClass from './typeClass';
import EntityId from './typeEntityIds';
import Placeholder from './Placeholder';

const entitiesList:Record<EntityId, EntityClass<Entity>> = {
  [EntityId.Placeholder]: Placeholder,
};

export default entitiesList;
