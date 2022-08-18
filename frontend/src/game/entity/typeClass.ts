import Point from '../helperTypes/point';

type EntityClass<A> = new(position:Point)=>A;

export default EntityClass;
