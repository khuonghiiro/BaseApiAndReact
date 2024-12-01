import { useState } from 'react';
import { Step } from 'react-joyride';

interface InitialSteps {
  [key: string]: { selector: string; content: JSX.Element }[];
}

export const useStartTour = (initialSteps: InitialSteps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [tourTitle, setTourTitle] = useState<string>("");

  const startTour = (section: keyof InitialSteps, title: string) => {
    const tourSteps = initialSteps[section].map((step) => ({
      target: step.selector,
      content: step.content,
      title: title,
      next: "Tiếp tục",
      back: "Quay lại",
      close: "Đóng"
    }));
    setSteps(tourSteps);
    setTourTitle(title);
    setCurrentStep(0);
    setIsOpen(true);
  };

  return { startTour, currentStep, setCurrentStep, setIsOpen, steps, isOpen, tourTitle };
};
