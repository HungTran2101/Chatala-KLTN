import Image from 'next/image';
import logo from '../../../assets/imgs/LogoFullLong.png';
import chatbot from '../../../assets/imgs/chatbot.png';
import * as S from './Welcome.styled';
import { useSelector } from 'react-redux';
import { selectUtilState } from '../../../features/redux/slices/utilSlice';

interface IWelcome {
  home?: boolean;
}

const Welcome = ({ home = false }: IWelcome) => {
  const UIText = useSelector(selectUtilState).UIText.welcome;

  return (
    <S.Welcome home={home}>
      <S.WelcomeContent>
        <S.WelcomeText>
          {UIText.welcomeLabel}
          <S.WelcomeLogo>
            <Image src={logo} alt="WelcomeLogo" />
          </S.WelcomeLogo>
        </S.WelcomeText>
        <S.WelcomeFeature>
          <S.WelcomeFeatureImage home={home}>
            <Image src={chatbot} alt="chatbot feature" />
          </S.WelcomeFeatureImage>
          <S.WelcomeFeatureDescription>
            {UIText.description}
          </S.WelcomeFeatureDescription>
          {/* <S.WelcomeFeatureDetail>
          Now you can chat with friends, video call, find new friends quickly on the website
          </S.WelcomeFeatureDetail> */}
        </S.WelcomeFeature>
      </S.WelcomeContent>
    </S.Welcome>
  );
};

export default Welcome;
