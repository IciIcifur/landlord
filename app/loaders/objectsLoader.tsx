'use client';
import { useEffect } from 'react';
import objectsStore from '@/app/stores/objectsStore';

export default function ObjectsLoader({ objects }: { objects: any[] }) {
  useEffect(() => {
    objectsStore.setAllObjects(objects);
  }, [objects]);

  return null;
}
