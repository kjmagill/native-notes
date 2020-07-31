import React, { Component } from 'react';
import {
  ScrollView,
  FlatList,
  ActivityIndicator,
  View,
  Alert
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { Container, PlaceholdeWrapper, HeaderText } from './styled';
import { Button, NoteCard, TextPlaceHolder } from '../components';

const GET_NOTES = gql`
  query {
    notes {
      id
      text
    }
  }
`;

const DELETE_NOTE = gql`
  mutation DeleteNote($id: ID!) {
    deleteNote(id: $id) {
      id
      text
    }
  }
`;

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteId: null
    };
  }

  _addNewNote = () => {
    const { navigation } = this.props;
    navigation.navigate('NewNote', {});
  };

  _renderItem({ item }) {
    return (
      <NoteCard
        noteText={item.text}
        onOptions={() => this._showEditDeleteOptions(item.id)}
      />
    );
  }

  _showEditDeleteOptions = async noteId => {
    await this.setState({ noteId });
    this.deleteActionSheet.show();
  };

  _deletePostPrompt = noteId => {
    Alert.alert('Delete Note ?', null, [
      {
        text: 'Delete',
        onPress: () => {
          this._deleteNote({ noteId });
        }
      },
      {
        text: 'Cancel',
        style: 'Cancel'
      }
    ]);
  };

  _deleteNote = noteId => {
    <Mutation
      mutation={DELETE_NOTE}
      update={store => {
        const storeNotes = store.readQuery({ query: GET_NOTES });
        const data = storeNotes.notes.filter(note => note.id !== noteId);
        store.writeQuery({
          query: GET_NOTES,
          data: { notes: [...data] }
        });
      }}
    ></Mutation>;
  };

  render() {
    const { noteId } = this.state;
    return (
      <Container>
        <View>
          <ActionSheet
            ref={o => (this.deleteActionSheet = o)}
            options={['Delete', 'Cancel']}
            cancelButtonIndex={1}
            destructiveButtonIndex={0}
            onPress={index => {
              if (index === 0) this._deletePostPrompt(noteId);
            }}
          />
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <HeaderText>My Notes</HeaderText>
          <PlaceholdeWrapper>
            <TextPlaceHolder
              onHolderPress={() => this._addNewNote()}
              text={'Add new note'}
            />
          </PlaceholdeWrapper>
          <Query query={GET_NOTES}>
            {/* The props.children of the Query will be a callback with both a response and an error parameter. */}
            {(response, error, loading) => {
              if (error) {
                return <Text style={styles.errorText}>{error}</Text>;
              }
              if (loading) {
                return <ActivityIndicator />;
              }
              if (response) {
                //Return the FlatList if there is not an error.
                return (
                  <FlatList
                    data={response.data.notes}
                    renderItem={item => this._renderItem(item)}
                  />
                );
              }
            }}
          </Query>
        </ScrollView>
      </Container>
    );
  }
}

export default HomeScreen;
