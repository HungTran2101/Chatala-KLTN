import * as S from './CropImage.styled';

import { useState } from 'react';
import Cropper from 'react-easy-crop';
import { BiCrop } from 'react-icons/bi';
import { MdCancelPresentation } from 'react-icons/md';
import getCroppedImg from '../../../../Global/ProcessFunctions';
import { Modal } from 'antd';
import { useSelector } from 'react-redux';
import { selectUtilState } from '../../../../../features/redux/slices/utilSlice';

interface ICrop {
  image: string | ArrayBuffer | null;
  closeModal: () => void;
  open: boolean;
  setPreviewAvt: (avatar: string) => void;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
}

const CropImage = ({
  image,
  closeModal,
  open,
  setPreviewAvt,
  setFieldValue,
}: ICrop) => {
  const UIText = useSelector(selectUtilState).UIText.topBar.info;

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>();

  const cropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onCrop = async () => {
    const croppedImage: any = await getCroppedImg(
      image,
      croppedAreaPixels,
      rotation
    );
    setFieldValue('avatar', croppedImage.file);
    setPreviewAvt(croppedImage.url);
    closeModal();
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
      <S.Content>
        <Cropper
          image={image as string | undefined}
          crop={crop}
          zoom={zoom}
          maxZoom={10}
          rotation={rotation}
          aspect={1}
          cropShape="round"
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropChange={setCrop}
          onCropComplete={cropComplete}
        />
      </S.Content>
      <S.Action>
        <S.ZoomAndRotate>
          <p>{`${UIText.update.cropZoom}: ${zoom * 10}%`}</p>
          <S.Slider
            type="range"
            min={1}
            max={10}
            step={0.5}
            value={zoom}
            onInput={(e) => setZoom(Number(e.currentTarget.value))}
          />
        </S.ZoomAndRotate>
        <S.ZoomAndRotate>
          <p>{`${UIText.update.cropRotate}: ${rotation}°`}</p>
          <S.Slider
            type="range"
            min={1}
            max={360}
            step={1}
            value={rotation}
            onInput={(e) => setRotation(Number(e.currentTarget.value))}
          />
        </S.ZoomAndRotate>
        <S.ButtonCropZone>
          <S.Button onClick={onCrop}>
            <BiCrop />
            <p>{UIText.update.cropConfirm}</p>
          </S.Button>
          <S.Button onClick={() => closeModal()}>
            <MdCancelPresentation />
            <p>{UIText.update.cropCancel}</p>
          </S.Button>
        </S.ButtonCropZone>
      </S.Action>
    </Modal>
  );
};

export default CropImage;
