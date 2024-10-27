import ScheduleIcon from '@mui/icons-material/Schedule';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import useLocalStorage from './useLocalStorage';

export type Item = {
  id: string;
  name: string;
  createdAt: number;
  laps: number[];
};

export const useTasks = () => useLocalStorage<Item[]>('time-since-items', []);

export const sortOptions = [
  { key: 'title', label: 'Title', icon: <SortByAlphaIcon fontSize="small" /> },
  {
    key: 'timeElapsed',
    label: 'Time elapsed',
    icon: <TimelapseIcon fontSize="small" />,
  },
  {
    key: 'createdAt',
    label: 'Date added',
    icon: <ScheduleIcon fontSize="small" />,
  },
] as const;

export type SortBy = (typeof sortOptions)[number]['key'];
export const useSortBy = () =>
  useLocalStorage<{
    key: SortBy;
    order: 'asc' | 'desc';
  }>('time-since-sort', {
    key: 'createdAt',
    order: 'asc',
  });
