'use client';
import { useEffect } from 'react';
import objectsStore from '@/app/stores/objectsStore';
import { RentalObject } from '@/app/lib/utils/definitions';

export default function ObjectLoader({
  object,
}: {
  object: RentalObject | null;
}) {
  useEffect(() => {
    if (object) objectsStore.setActiveObject(object);
    return () => objectsStore.setActiveObject(null);
  }, [object]);

  return null;
}
