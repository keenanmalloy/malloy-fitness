interface SurveyButtonProps {
  number: number;
  text: string;
  onClick: () => void;
  textColor: string;
  bgColor: string;
}

export function SurveyButton({
  number,
  text,
  textColor,
  bgColor,
  onClick,
}: SurveyButtonProps) {
  return (
    <button
      className={`h-12 w-1/5 border-solid border-2 border-slate-500 flex flex-col justify-center items-center ${textColor} ${bgColor}`}
      onClick={onClick}
    >
      <p>{number}</p>
      <span
        className="flex"
        style={{
          fontSize: '0.7rem',
        }}
      >
        {text}
      </span>
    </button>
  );
}
