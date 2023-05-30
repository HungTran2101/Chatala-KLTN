import * as S from './General.styled';
import vnflag from '../../../../../assets/imgs/vietnamflag.png';
import usflag from '../../../../../assets/imgs/usflag.png';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectUserState,
  userActions,
} from '../../../../../features/redux/slices/userSlice';
import { UsersApi } from '../../../../../services/api/users';
import {
  selectUtilState,
  utilActions,
} from '../../../../../features/redux/slices/utilSlice';

const General = () => {
  const user = useSelector(selectUserState);
  const UIText = useSelector(selectUtilState).UIText.topBar.setting.general;

  const dispatch = useDispatch();

  const changeLocale = async (locale: string) => {
    const res = await UsersApi.changeLocale(locale);
    console.log(res);
    dispatch(userActions.setUserInfo(res.user));
    dispatch(utilActions.setUIText({ locale }));
  };

  return (
    <S.General>
      <S.LanguageItem>
        <S.GeneralItemLanguageLabel>
          {UIText.language.label}
        </S.GeneralItemLanguageLabel>
        <S.GeneralItemLanguageButton
          active={user.info.locale === 'en' ? 1 : 0}
          onClick={() => changeLocale('en')}
        >
          <Image src={usflag} alt="flag" layout="fill" />
        </S.GeneralItemLanguageButton>
        <S.GeneralItemLanguageButton
          active={user.info.locale === 'vi' ? 1 : 0}
          onClick={() => changeLocale('vi')}
        >
          <Image src={vnflag} alt="flag" layout="fill" />
        </S.GeneralItemLanguageButton>
      </S.LanguageItem>
    </S.General>
  );
};

export default General;
