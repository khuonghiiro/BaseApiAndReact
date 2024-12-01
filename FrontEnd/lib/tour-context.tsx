import React, { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import Joyride, { Step, CallBackProps, STATUS, EVENTS, ACTIONS } from 'react-joyride';
import StartEndModal from '@/app/admin/ticket/_components/start-end-modal';
import { useAuth } from '@/shared/Context/appAdminContext';
import parse from 'html-react-parser';
import { ApiUrl } from '@/public/app-setting';

interface StepDetail {
  title?: string;
  selector: string;
  content: string | JSX.Element;
  order: number;
  isClickElem?: boolean;
  attachment?: any;
}

interface InitialSteps {
  [key: string]: StepDetail[];
}

interface CustomStep extends Omit<Step, 'target'> {
  target: string;
}

interface TourContextProps {
  startTour: (section: keyof InitialSteps, title: string) => void;
  setInitialSteps: (steps: InitialSteps) => void;
}

const TourContext = createContext<TourContextProps | undefined>(undefined);

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [initialSteps, setInitialStepsState] = useState<InitialSteps>({});
  const [steps, setSteps] = useState<CustomStep[]>([]);
  const [run, setRun] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [tourTitle, setTourTitle] = useState<string>("");
  const [tourKey, setTourKey] = useState<keyof InitialSteps | null>(null);
  const [userId, setUserId] = useState<number>(0);
  const { user } = useAuth();
  const [isEvenClick, setIsEvenClick] = useState(false);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [isModalOpenStart, setIsModalOpenStart] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFirst, setIsInitFirst] = useState(false);
  const checkingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [reloadData, setReloadData] = useState<number>(0);
  const [pendingTour, setPendingTour] = useState<{ section: keyof InitialSteps, title: string } | null>(null);

  useEffect(() => {
    setUserId(user.idTaiKhoan);
  }, [user]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const startTour = useCallback((section: keyof InitialSteps, title: string) => {
    const tourStatus = localStorage.getItem(`${userId}-tourStatus-${section}`);

    if (tourStatus === STATUS.FINISHED || tourStatus === STATUS.SKIPPED) {
      setIsModalOpenStart(false);
      return;
    }

    if (!isFirst) {
      setPendingTour({ section, title });
      setIsModalOpenStart(true);
      return;
    }

    const getLinkImage = (fileImage: any) => {
      const parsedData = typeof fileImage === 'string' ? JSON.parse(fileImage) : fileImage;

      return (parsedData.length > 0) ? `<img className="!mx-auto w-[50%]" src="${(ApiUrl + "fileupload/api/file/" + parsedData[0]?.guiid)}" alt="GIF" />` : '<div></div>';
    };

    const stepsForSection = initialSteps[section];
    if (!stepsForSection) {
      console.error(`Không tìm thấy key: ${section}, do array[${section}]: ${initialSteps[section]}`);
      return;
    }

    setTourKey(section);

    const sortedSteps = stepsForSection.sort((a, b) => a.order - b.order);
    const tourSteps: CustomStep[] = sortedSteps.map((step) => ({
      target: step.selector,
      content: (typeof step.content === 'string') ? parse(`
          <div>
            <div className="text-center"> 
              <h1>${step.title ?? ''}</h1>
              ${getLinkImage(step.attachment)}
              
            </div>
            ${step.content}
          </div>
        `) : step.content,
      title: title,
      disableBeacon: true,
      spotlightClicks: step.isClickElem ?? false,
    }));

    setSteps(tourSteps);
    setTourTitle(title);
    setStepIndex(0);
    setRun(true);
  }, [initialSteps, userId, isFirst]);

  useEffect(() => {
    if (isFirst && pendingTour) {
      startTour(pendingTour.section, pendingTour.title);
      setPendingTour(null);
    }
  }, [isFirst, pendingTour, startTour]);

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status, action, index, type } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      localStorage.setItem(`${userId}-isStartPopup`, "true");
      localStorage.setItem(`${userId}-tourStatus-${tourKey}`, status);
    }

    if (status === STATUS.FINISHED) {
      setIsModalOpen(true);
    }

    const currentStep = steps[index];

    if (currentStep && currentStep.spotlightClicks !== undefined) {
      let attempts = 0;
      checkingIntervalRef.current = setInterval(() => {
        const element = document.querySelector(currentStep.target);
        if ((element || attempts >= 30) && (action === ACTIONS.START || (currentStep.spotlightClicks && action === ACTIONS.UPDATE))) {
          clearInterval(checkingIntervalRef.current as NodeJS.Timeout);
          checkingIntervalRef.current = null;
          if (!element) {
            console.warn(`Không tìm thấy phần tử với selector: ${currentStep.target}. Bỏ qua bước này.`);
            setStepIndex(s => s + 1);
          }
        }
        attempts++;
      }, 100);
      setIsEvenClick(currentStep.spotlightClicks);
    } else {
      setIsEvenClick(false);
    }

    if (type === EVENTS.STEP_AFTER && action === ACTIONS.NEXT && isEvenClick && currentStep?.spotlightClicks) {
      await handleButtonClick(currentStep?.target as string, index);
    }

    if (type === EVENTS.STEP_AFTER && status === STATUS.RUNNING) {
      if (action === ACTIONS.NEXT || action === ACTIONS.PREV || action === ACTIONS.CLOSE) {
        setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
      }
    }
  };

  const handleButtonClick = async (selector: string, index: number): Promise<void> => {
    return new Promise((resolve) => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        element.click();

        setTimeout(() => {
          const nextStep = steps[index + 1];
          if (nextStep) {
            let attempts = 0;
            const interval = setInterval(() => {
              const nextElement = document.querySelector(nextStep.target);
              if (nextElement || attempts >= 30) {
                clearInterval(interval);
                if (!nextElement) {
                  console.warn(`Không tìm thấy phần tử với selector: ${nextStep.target}. Bỏ qua bước này.`);
                }
                resolve();
              }
              attempts++;
            }, 100);
          } else {
            resolve();
          }
        }, 0);
      } else {
        console.warn(`Không tìm thấy phần tử với selector: ${selector}. Bỏ qua bước này.`);
        setStepIndex(prevIndex => prevIndex + 1);
        resolve();
      }
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseModalStart = () => {
    setIsModalOpenStart(false);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
  };

  const handleConfirmStart = () => {
    setIsInitFirst(true);
    setIsModalOpenStart(false);
  };

  return (
    <TourContext.Provider value={{ startTour, setInitialSteps: setInitialStepsState }}>
      {children}
      {isClient && (
        <>
          <Joyride
            steps={steps}
            stepIndex={stepIndex}
            run={run}
            continuous={true}
            scrollToFirstStep
            showProgress
            showSkipButton
            callback={handleJoyrideCallback}
            disableOverlayClose={isEvenClick}
            disableCloseOnEsc={!isEvenClick}
            spotlightClicks={isEvenClick ? false : true}
            locale={{
              back: "Quay lại",
              close: "Đóng",
              last: "Kết thúc",
              next: isEvenClick ? "Nhấn tiếp" : "Tiếp tục",
              open: "Mở hộp thoại",
              skip: "Bỏ qua"
            }}
            styles={{
              tooltipTitle: {
                fontWeight: 'bold',
                color: '#e91e63',
              },
              buttonBack: isEvenClick ? { display: 'none' } : {},
            }}
          />
          <StartEndModal
            isOpen={isModalOpenStart}
            onClose={handleCloseModalStart}
            title="Bắt đầu hướng dẫn"
            content={<img className="!mx-auto w-[50%]" src="../start.gif" alt="GIF bắt đầu" />}
            onConfirm={handleConfirmStart}
            btnNameYes="Bắt đầu"
          />
          <StartEndModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="Hoàn thành hướng dẫn"
            content={<img className="!mx-auto w-[50%]" src="../hourglass.gif" alt="GIF kết thúc" />}
            onConfirm={handleConfirm}
            btnNameYes="Kết thúc"
          />
        </>
      )}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const context = useContext(TourContext);
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};
