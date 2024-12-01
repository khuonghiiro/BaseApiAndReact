import React, { useEffect, useState } from 'react';
import { useTour } from '@/lib/tour-context';
import { useTourDataContext } from './use-tour-data-context';

interface TourStep {
  selector: string;
  content: JSX.Element;
  order: number;
  isClickElem?: boolean;
}

interface TourSteps {
  [key: string]: TourStep[];
}

const TourStepCommon = ({ tourKey, tourTitle }: { tourKey: string, tourTitle?: string }) => {
  const [isLoadingInit, setIsLoadingInit] = useState(true);
  const [stepsSet, setStepsSet] = useState(false);
  const [dataSteps, setDataSteps] = useState<TourSteps>({});
  const data = useTourDataContext(); // Sử dụng context để lấy data

  useEffect(() => {
    setIsLoadingInit(false);
  }, []);

  const { startTour, setInitialSteps } = useTour();

  useEffect(() => {
    if (!isLoadingInit && data) {
      setInitialSteps(data);
      setDataSteps(data);
      setStepsSet(true);
    }
  }, [isLoadingInit, data]);

  useEffect(() => {
    if (tourKey && dataSteps[tourKey] && stepsSet) {
      startTour(tourKey, tourTitle ?? '');
    } else if (!dataSteps[tourKey]) {
      console.log(`Không tìm thấy key trong hướng dẫn steps: ${tourKey}`);
    }
  }, [tourKey, stepsSet, dataSteps]);

  return null;
};

export default TourStepCommon;
