type EmptyAction = () => void;
type Action<T> = (a: T) => void;
type Func0<T> = () => T;
type Func1<T1, T2> = (a: T1) => T2;
type Func2<T1, T2, T3> = (a: T1, b: T2) => T3;
