import React from 'react';
import { Box, createListCollection, Flex } from '@chakra-ui/react';
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from '../../../components/ui/select';
import { Button } from '../../../components/ui/button';

interface IDonationStatus {
  value: string[];
  onUpdate: () => void;
  onChange: (val: string[]) => void;
  loading: boolean;
}

const DonationStatus: React.FC<IDonationStatus> = ({
  value,
  onChange,
  onUpdate,
  loading,
}) => {
  return (
    <Box>
      <SelectRoot
        onValueChange={({ value }) => onChange(value)}
        value={value}
        outline={'none'}
        collection={statuses}
        size="sm"
      >
        <SelectTrigger>
          <SelectValueText placeholder="Select status" />
        </SelectTrigger>
        <SelectContent zIndex={2000}>
          {statuses.items.map((status) => (
            <SelectItem item={status} key={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
      <Flex justifyContent={'flex-end'} mt={12}>
        <Button loading={loading} onClick={onUpdate} colorPalette="brand">
          Update
        </Button>
      </Flex>
    </Box>
  );
};

export default DonationStatus;

const statuses = createListCollection({
  items: [
    { label: 'COMPLETED', value: 'COMPLETED' },
    { label: 'REJECTED', value: 'REJECTED' },
    { label: 'PENDING', value: 'PENDING' },
  ],
});
