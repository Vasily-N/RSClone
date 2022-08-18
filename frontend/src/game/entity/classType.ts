import Point from '../types/Point';

type EntityClass<A> = new(position:Point)=>A;

export default EntityClass;
