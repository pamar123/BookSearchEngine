import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

interface Book {
  bookId: string;
  authors: string[];
  description: string;
  title: string;
  image?: string;
  link?: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  savedBooks: Book[];
  bookCount: number;
}

const SavedBooks = () => {
  const { loading, error, data, refetch } = useQuery(GET_ME);
  const [removeBook, { error: removeError }] = useMutation(REMOVE_BOOK);

  const userData: User | undefined = data?.me;

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId: string) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId }
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
      
      // Refetch the user data to update the UI
      refetch();
    } catch (err) {
      console.error('Error removing book:', err);
    }
  };

  if (loading) {
    return (
      <Container>
        <h2>Loading...</h2>
      </Container>
    );
  }

  if (error || !userData) {
    return (
      <Container>
        <h2>Error loading your saved books!</h2>
        <p>{error?.message || 'Please try again later.'}</p>
      </Container>
    );
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          <h1>Viewing {userData.username}'s saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md='4' key={book.bookId}>
                <Card border='dark'>
                  {book.image && (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors.join(', ')}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                    {removeError && (
                      <p className="text-danger mt-2">Error removing book! Please try again.</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;