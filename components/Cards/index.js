import React from 'react';
import { Images } from '../../constants';
import {
  CardContainer,
  TimestampContainer,
  EditWrapper,
  EditIcon,
  CardText,
  HeaderContainer,
} from './styled';
// import PropTypes from 'prop-types';

const NoteCard = (props) => {
  const { onOptions, noteText } = props;
  return (
    <CardContainer>
      <HeaderContainer>
        <CardText>{noteText}</CardText>
        <EditWrapper onPress={onOptions}>
          <EditIcon source={Images.more} />
        </EditWrapper>
      </HeaderContainer>
      <TimestampContainer>1 hour ago</TimestampContainer>
    </CardContainer>
  );
};

export default NoteCard;
