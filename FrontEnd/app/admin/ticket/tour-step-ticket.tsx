import React, { useEffect, useState } from 'react';
import { useTour } from '@/lib/tour-context';
import { FaAngleDown, FaAnglesDown, FaAnglesUp, FaAngleUp, FaBusinessTime, FaEquals } from 'react-icons/fa6';
import { AiFillCheckCircle, AiFillDelete, AiFillEdit, AiOutlineSend, AiTwotoneEye } from 'react-icons/ai';
import { MdOpenInBrowser } from 'react-icons/md';
import { groupTourGuideServices } from '../grouptourguide/services';
import { ApiUrl, DefaulPer, DefaultMeta } from '@/public/app-setting';
import { getPermisson } from '@/lib';
import { useAuth } from '@/shared/Context/appAdminContext';

interface TourStep {
  title?: string;
  selector: string;
  content: string | JSX.Element;
  order: number;
  isClickElem?: boolean;
  attachment?: any;
}

interface TourSteps {
  [key: string]: TourStep[];
}

const TourStepTicket = (
  {
    tourKey,
    tourTitle,
  }:
    {
      tourKey: string,
      tourTitle?: string
    }
) => {

  const [isLoadingInit, setIsLoadingInit] = useState(true);
  const [meta, setMeta] = useState<any>({
    ...DefaultMeta,
  });
  const [permisson, setPermisson] = useState<any>({
    ...DefaulPer,
  });
  const { logout, user } = useAuth();
  const [stepsSet, setStepsSet] = useState(false); // State để theo dõi việc setInitialSteps đã hoàn tất
  const [dataSteps, setDataSteps] = useState<TourSteps>({}); // State để theo dõi việc setInitialSteps đã hoàn tất

  const fetchData = async () => {
    let listSteps = await groupTourGuideServices.GetListSteps(meta);
    if (listSteps) {
      setInitialSteps(listSteps);
      setDataSteps(listSteps);
      setStepsSet(true); // Đánh dấu rằng setInitialSteps đã hoàn tất
    }
  };

  useEffect(() => {
    // Set isLoading to false after the component has mounted
    setIsLoadingInit(false);

    setPermisson(getPermisson("grouptourguide"));

    setMeta({
      ...DefaultMeta,
      page_size: 1000,
      groupIds: user.unitCode.join(',')
    });
  }, []);

  const { startTour, setInitialSteps } = useTour();

  useEffect(() => {
    if (!isLoadingInit) {
      fetchData();
    }
  }, [isLoadingInit]);

  // // Hàm kiểm tra xem initialCusormerSteps có chứa mảng hay không
  // const hasArrays = (steps: TourSteps): boolean => {
  //   return Object.values(steps).some(stepArray => Array.isArray(stepArray) && stepArray.length > 0);
  // };

  useEffect(() => {

    if (tourKey && dataSteps[tourKey] && stepsSet) { // Kiểm tra thêm bước setStepsSet
      startTour(tourKey, tourTitle ?? '');
    }
    else if (!dataSteps[tourKey]) {
      console.log(`Không tìm thấy key trong hướng dẫn steps: ${tourKey}`);
    }
  }, [tourKey, stepsSet, dataSteps]); // Thêm stepsSet vào mảng phụ thuộc

  return null;
};

export default TourStepTicket;
