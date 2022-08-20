import { Point } from '../../shapes';

type EntityClass<A> = new(position:Point)=>A;

export default EntityClass;
