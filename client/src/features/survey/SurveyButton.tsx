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
      className={`h-12 w-1/5 rounded-md flex flex-col justify-center items-center ${textColor} ${bgColor} focus:ring-2 focus:ring-green-200`}
      onClick={onClick}
    >
      <p>{number}</p>
      <span
        className="flex uppercase pt-1"
        style={{
          fontSize: '0.6rem',
        }}
      >
        {text}
      </span>
    </button>
  );
}
