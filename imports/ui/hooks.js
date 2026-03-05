/**
 * Minimal useTracker hook — avoids importing react-meteor-data
 * (which pulls in meteor/mongo via useFind, creating a circular dep with afs).
 */
import { useState, useEffect, useRef } from 'react';
import { Tracker } from 'meteor/tracker';

export function useTracker(reactiveFn, deps = []) {
  const [data, setData] = useState(() =>
    Tracker.nonreactive(reactiveFn)
  );

  const reactiveFnRef = useRef(reactiveFn);
  reactiveFnRef.current = reactiveFn;

  useEffect(() => {
    const computation = Tracker.autorun(() => {
      const result = reactiveFnRef.current();
      setData(result);
    });

    return () => computation.stop();
  }, deps);

  return data;
}
