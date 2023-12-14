import React from 'react';

interface AvatarProps {
  imageUrl: string;
  altText: string;
  size?: 'small' | 'medium' | 'large';
}

const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  altText,
  size = 'medium',
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'w-8 h-8';
      case 'large':
        return 'w-12 h-12';
      // Medium size is the default
      default:
        return 'w-10 h-10';
    }
  };

  return (
    <img
      src={imageUrl}
      alt={altText}
      className={`rounded-full cursor-pointer ${getSizeClass()} object-cover`}
    />
  );
};

export default Avatar;
