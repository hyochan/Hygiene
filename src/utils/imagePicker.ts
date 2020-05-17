import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import { Image, Platform } from 'react-native';

export const THUMBNAIL_SIZES = {
  MAX_WIDTH: 192,
  MAX_HEIGHT: 192,
};

export interface ImageSize {
  width: number;
  height: number;
}

export const getOriginalImageSize = async (imageUri: string): Promise<ImageSize> => new Promise<ImageSize>(
  (resolve, reject) => Image.getSize(
    imageUri,
    (width: number, height: number) => resolve({
      width,
      height,
    }),
    reject,
  ),
);

export const resizeImage = async ({
  imageUri,
  maxWidth,
  maxHeight,
}: {
  imageUri: string;
  maxWidth?: number;
  maxHeight?: number;
}): Promise<ImageManipulator.ImageResult> => {
  const manipulate = ({
    width,
    height,
  }: {
    width?: number;
    height?: number;
  }): Promise<ImageManipulator.ImageResult> => ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width, height } }],
    { compress: 1, format: ImageManipulator.SaveFormat.PNG },
  );

  const { width: originWidth, height: originHeight } = await getOriginalImageSize(imageUri);

  if (originWidth >= originHeight) {
    if (maxWidth === undefined || maxWidth === null) {
      if (originWidth < THUMBNAIL_SIZES.MAX_WIDTH) {
        return manipulate({ width: originWidth });
      }

      return manipulate({ width: THUMBNAIL_SIZES.MAX_WIDTH });
    }

    if (originWidth < maxWidth) {
      return manipulate({ width: originWidth });
    }

    return manipulate({ width: maxWidth });
  }

  if (maxHeight === undefined || maxHeight === null) {
    if (originHeight < THUMBNAIL_SIZES.MAX_HEIGHT) {
      return manipulate({ height: originHeight });
    }

    return manipulate({ height: THUMBNAIL_SIZES.MAX_HEIGHT });
  }

  if (originHeight < maxHeight) {
    return manipulate({ height: originHeight });
  }

  return manipulate({ height: maxHeight });
};

enum MediaTypeOptions {
  All = 'All',
  Videos = 'Videos',
  Images = 'Images',
}

enum PermissionStatus {
  UNDETERMINED = 'undetermined',
  GRANTED = 'granted',
  DENIED = 'denied',
}

const photoOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  exif: true,
};

const requestPermissions = async (
  type: string,
): Promise<Permissions.PermissionStatus> => {
  if (type === 'photo') {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    return status;
  }
  const { status } = await Permissions.askAsync(Permissions.CAMERA);
  return status;
};

export const launchCameraAsync = async (): Promise<ImagePicker.ImagePickerResult | null> => {
  const permissionStatus = await requestPermissions('camera');
  if (permissionStatus === PermissionStatus.GRANTED) {
    return ImagePicker.launchCameraAsync(photoOptions);
  }
  return null;
};

export const launchImageLibraryAsync = async (): Promise<ImagePicker.ImagePickerResult | null> => {
  if (Platform.OS === 'web') {
    return ImagePicker.launchImageLibraryAsync(photoOptions);
  }
  const permissionStatus = await requestPermissions('photo');
  if (permissionStatus === PermissionStatus.GRANTED) {
    return ImagePicker.launchImageLibraryAsync(photoOptions);
  }
  return null;
};
