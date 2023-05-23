import Image from 'next/image';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import Cropper from 'react-easy-crop';
import { useState, FormEvent } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { AiFillCamera } from 'react-icons/ai';

import * as Yup from 'yup';
import * as S from './SettingInfo.styled';
import { validImageTypes } from '../../../Global/ProcessFunctions';
import { Formik, ErrorMessage } from 'formik';
import { UserAvatar } from '../../../../utils/dataConfig';
import { updateUserInfo, info } from '../../../../utils/types';
import {
  API_KEY,
  MessageApi,
  CLOUD_NAME,
  UPLOAD_PRESET,
} from '../../../../services/api/messages';
import { API_URL } from '../../../../services/api/urls';
import CropImage from './CropImage';
import { UsersApi } from '../../../../services/api/users';
import { useDispatch } from 'react-redux';
import { userActions } from '../../../../features/redux/slices/userSlice';
import { json } from 'stream/consumers';
import { Input, Modal, message } from 'antd';
import moment from 'moment';

interface ISetingInfo {
  id: string;
  name: string;
  gender: string;
  dob: string;
  avatar: string;
  closeModal: () => void;
  open: boolean;
}

const SettingInfo = ({
  id,
  name,
  gender,
  dob,
  avatar,
  closeModal,
  open,
}: ISetingInfo) => {
  const dispatch = useDispatch();
  const [previewAvt, setPreviewAvt] = useState<string>(avatar);
  const [cropImage, setCropImage] = useState<string | ArrayBuffer | null>(null);
  const [modalCrop, setModalCrop] = useState(false);

  const initialValues = {
    id: id || '',
    name: name || '',
    gender: gender || 'male',
    dob: dob || new Date(),
    avatar: avatar || '',
  };

  const toggleEvent = () => {
    closeModal();
  };

  const handleCrop = (e: FormEvent<HTMLInputElement>) => {
    let input = e.currentTarget;
    if (input.files?.length) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const typeImage = reader.result.slice(0, 10);
        if (typeImage !== 'data:image') {
          message.info('Please choose an image file');
        } else {
          setModalCrop(true);
          setCropImage(reader.result);
        }
      });
      reader.readAsDataURL(input.files[0]);
    }
    e.currentTarget.value = null;
  };

  const uploadFile = async (file: File) => {
    const signedKey = await MessageApi.getSignedKey(id);

    const form = new FormData();
    form.append('file', file);
    form.append('public_id', id);
    form.append('api_key', API_KEY);
    form.append('upload_preset', UPLOAD_PRESET);
    form.append('timestamp', signedKey.timestamp.toString());
    form.append('signature', signedKey.signature);

    const response = await fetch(
      `${API_URL.uploadFile}/${CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: form,
      }
    ).then((response) => {
      return response.json();
    });

    return response.secure_url;
  };

  const onSubmit = async (values: info) => {
    try {
      let updated = false;

      if (avatar !== values.avatar) {
        const fileAvt = new File([values.avatar], id, {
          // @ts-ignores
          type: values.avatar?.type,
        });
        const avatarUrl = await uploadFile(fileAvt);
        if (avatarUrl) {
          const result = await UsersApi.editAvatar(avatarUrl);
          message.success(result.message);
          updated = true;
        } else {
          message.error('Update avatar failed! Try again later.');
        }
      }

      if (
        name !== values.name ||
        gender !== values.gender ||
        dob !== values.dob
      ) {
        const newValue: updateUserInfo = {
          name: values.name,
          gender: values.gender,
          dob: values.dob,
        };
        const result = await UsersApi.editUserInfo(newValue);
        message.success(result.message);
        updated = true;
      }
      if (updated) {
        const result = await UsersApi.getLoggedUser();
        dispatch(userActions.setUserInfo(result));
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Modal
      open={open}
      closeIcon={<></>}
      onOk={closeModal}
      onCancel={closeModal}
      footer={<></>}
      destroyOnClose
      centered
    >
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleChange, setFieldValue, values, errors, touched }) => (
          <>
            <CropImage
              image={cropImage}
              open={modalCrop}
              closeModal={() => setModalCrop(false)}
              setPreviewAvt={setPreviewAvt}
              setFieldValue={setFieldValue}
            />
            <S.Header>
              <S.Banner>
                <Image src={UserAvatar} layout='fill' objectFit='cover' />
              </S.Banner>
              <S.AvatarLabel htmlFor='avatar'>
                <Image src={previewAvt} layout='fill' objectFit='cover' />
              </S.AvatarLabel>
              <S.UpdateAvatar htmlFor='avatar'>
                <AiFillCamera />
                <input
                  type='file'
                  id='avatar'
                  name='avatar'
                  onChange={(e) => handleCrop(e)}
                />
              </S.UpdateAvatar>
            </S.Header>
            <S.Content>
              <S.NewForm>
                <S.SetWidth>
                  <Input
                    placeholder='Name'
                    size='large'
                    name='name'
                    onChange={handleChange}
                    value={values.name}
                    status={errors.name && touched.name ? 'error' : ''}
                  />
                  <ErrorMessage name='name' component={S.ErrorMsg} />
                  <S.GenderWrap>
                    <S.GenderTitle>Gender</S.GenderTitle>
                    <S.GroupLabel>
                      <S.Label>
                        <S.Radio type='radio' value='male' name='gender' />
                        Male
                      </S.Label>
                      <S.Label>
                        <S.Radio type='radio' value='female' name='gender' />
                        Female
                      </S.Label>
                    </S.GroupLabel>
                  </S.GenderWrap>
                  <S.DatePickerElement>
                    <DatePicker
                      name='dob'
                      dateFormat='d MMMM, yyyy'
                      wrapperClassName='date_picker'
                      selected={new Date(values.dob)}
                      customInput={<Input size='large' />}
                      onChange={(value) => {
                        setFieldValue('dob', value);
                      }}
                    />
                  </S.DatePickerElement>
                  <S.GroupButton>
                    <S.Button type='submit'>Update</S.Button>
                    <S.Button onClick={() => toggleEvent()}>Cancel</S.Button>
                  </S.GroupButton>
                </S.SetWidth>
              </S.NewForm>
            </S.Content>
          </>
        )}
      </Formik>
    </Modal>
  );
};

export default SettingInfo;
