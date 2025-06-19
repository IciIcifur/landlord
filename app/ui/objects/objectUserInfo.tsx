'use client';

import { Card, CardBody } from '@heroui/card';
import UserChip from '@/app/ui/users/userChip';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import objectsStore from '@/app/stores/objectsStore';
import { observer } from 'mobx-react-lite';
import { Autocomplete, AutocompleteItem } from '@heroui/autocomplete';
import userStore from '@/app/stores/userStore';
import { User } from '@/app/lib/utils/definitions';
import {
  AddUserToObject,
  RemoveUserFromObject,
} from '@/app/lib/actions/clientApi';

const ObjectUserInfo = observer(({ objectId }: { objectId: string }) => {
  const object = useMemo(
    () => objectsStore.getObjectById(objectId),
    [objectId],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [newUserId, setNewUserId] = useState('');

  useEffect(() => {
    if (newUserId)
      handleAddObjectUser(newUserId).catch((error: any) =>
        console.error(error),
      );
    setNewUserId('');
  }, [newUserId]);

  const handleAddObjectUser = async (id: string) => {
    setIsLoading(true);
    try {
      const response: any = await AddUserToObject(object.id, id);
      if (!('errors' in response)) {
        const user = userStore.allUsers.find((user) => user.id === id);
        if (user) objectsStore.addObjectUser(object.id, user);
      } else {
        console.error(response.errors);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };
  const handleDeleteObjectUser = async (id: string) => {
    setIsLoading(true);
    try {
      const response: any = await RemoveUserFromObject(object.id, id);
      if (!('errors' in response)) {
        objectsStore.deleteObjectUser(object.id, id);
      } else {
        console.error(response.errors);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full">
      <CardBody className="flex flex-col gap-2 p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex w-full flex-nowrap items-center gap-2">
              <h3 className="text-lg font-medium">{object.name}</h3>
              <p className="text-xs text-default-400">ID: {object.id}</p>
            </div>
          </div>
          <div className="flex w-full justify-between gap-4">
            <p className="w-full text-small font-medium text-default-400">
              {object.address}
            </p>
          </div>
        </div>

        <h4 className="w-full text-small font-medium">
          Пользователи, которым доступен этот объект:
        </h4>
        <Autocomplete
          className="max-w-sm"
          selectedKey={newUserId}
          onSelectionChange={(key) => setNewUserId(key as string)}
          variant="bordered"
          placeholder="Выдать доступ..."
          size="sm"
          radius="full"
          isVirtualized={true}
          name="user_search"
          aria-label="user_search"
          isLoading={isLoading}
        >
          {userStore.allUsers
            .filter(
              (user) =>
                (object.users || []).findIndex(
                  (objectUser) => objectUser.id === user.id,
                ) < 0,
            )
            .map(
              (item: User) =>
                (
                  <AutocompleteItem key={item.id} textValue={item.email}>
                    {item.email}
                  </AutocompleteItem>
                ) as any,
            )}
        </Autocomplete>

        {
          (object.users?.length ? (
            <div className="flex flex-wrap gap-2">
              {object.users?.map((user) => (
                <UserChip
                  key={user.id}
                  user={user}
                  onDelete={handleDeleteObjectUser}
                />
              ))}
            </div>
          ) : (
            <p className="w-full text-small font-medium text-default-500">
              Нет пользователей, которым доступен объект
            </p>
          )) as ReactNode
        }
      </CardBody>
    </Card>
  );
});

export default ObjectUserInfo;
