import * as S from './Button.styled';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'red' | 'blue';
}

const Button = ({ variant = 'red', ...props }: ButtonProps) => {
  return <S.Button {...props} variant={variant} />;
};

export default Button;
