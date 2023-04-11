import * as S from "./FormTemplate.styled";
import Welcome from "../Welcome";

interface childrenProps {
  children: React.ReactNode;
}
const FormTemplate = ({ children }: childrenProps) => {
  return (
    <S.Content>
      <S.Wrapper>
        {children}
      </S.Wrapper>
      <Welcome />
    </S.Content>
  );
};

export default FormTemplate;
