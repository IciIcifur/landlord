'use client';

import { observer } from 'mobx-react-lite';
import userStore from '@/app/stores/userStore';
import UserCard from '@/app/ui/users/userCard';
import { Listbox, ListboxItem } from '@heroui/listbox';
import { Input } from '@heroui/input';
import { useState } from 'react';
import { SearchIcon, UserPlusIcon } from 'lucide-react';
import { Button } from '@heroui/button';
import { useDisclosure } from '@heroui/modal';
import NewUserModal from '@/app/ui/modals/newUserModal';
import { DeleteUser } from '@/app/lib/actions/clientApi';

const UsersList = observer(() => {
  const [searchValue, setSearchValue] = useState('');
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleDeleteUser = async (id: string) => {
    try {
      const response: any = await DeleteUser(id);
      if (!('errors' in response)) {
        userStore.deleteUser(id);
      } else {
        console.error(response.errors);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <div className="flex w-full flex-col gap-1">
        <div className="flex w-full items-center justify-between gap-2">
          <Input
            value={searchValue}
            onValueChange={setSearchValue}
            label="Найти пользователя"
            placeholder="landlord@example.com"
            endContent={<SearchIcon className="h-full stroke-default-400" />}
            name="user_search"
            aria-label="user_search"
          />
          <Button
            onPress={onOpen}
            isIconOnly
            variant="flat"
            color="primary"
            size="lg"
          >
            <UserPlusIcon />
          </Button>
        </div>
        <Listbox
          isVirtualized
          virtualization={{ maxListboxHeight: 466, itemHeight: 56 }}
          variant="faded"
          aria-label="all_users"
        >
          {userStore.allUsers
            .filter(
              (user) =>
                user.email.includes(searchValue) ||
                user.id.includes(searchValue),
            )
            .map(
              (user) =>
                (
                  <ListboxItem
                    key={user.id}
                    textValue={user.email}
                    color={
                      userStore.user?.id !== user.id ? 'default' : 'secondary'
                    }
                  >
                    <UserCard user={user} onDelete={handleDeleteUser} />
                  </ListboxItem>
                ) as any,
            )}
        </Listbox>
      </div>
      {isOpen && <NewUserModal isOpen={isOpen} onOpenChange={onOpenChange} />}
    </>
  );
});

export default UsersList;
