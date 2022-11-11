import { useMediaQuery } from '@mui/material';
import { Theme } from '@mui/system';

export const useUtils = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  return {
    isMobile
  }
}