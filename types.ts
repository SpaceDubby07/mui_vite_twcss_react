// Users
interface User {
  id: number;
  name: string;
  email: string;
}

interface UserTableProps {
  users: User[];
  deleteUser: (id: number) => Promise<void>;
  editUser: (user: User) => void;
}

interface AddUserProps {
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  isEditing: boolean;
  selectedUser: User | null;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// User Profiles
interface UserProfile {
  id: number;
  user_id: number;
  image: string;
  bio: string;
  date_of_birth: string;
  location: string;
}

interface UserProfileTableProps {
  users: User[];
  userProfiles: UserProfile[];
  deleteUserProfile: (id: number) => void;
  editUserProfile: (profile: UserProfile) => void;
}

interface AddUserProfileProps {
  users: User[];
  setUserProfiles: React.Dispatch<
    React.SetStateAction<UserProfile[]>
  >;
  isEditing: boolean;
  selectedProfile: UserProfile | null;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedProfile: React.Dispatch<
    React.SetStateAction<UserProfile | null>
  >;
}

// Posts
interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
}

interface UserPostTableProps {
  users: User[];
  UserPosts: Post[];
  deleteUserPost: (id: number) => void;
  editUserPost: (post: Post) => void;
}

interface AddUserPostProps {
  users: User[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  isEditing: boolean;
  selectedPost: Post | null;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPost: React.Dispatch<React.SetStateAction<Post | null>>;
}

// comments
interface Comments {
  id: number;
  user_id: number;
  post_id: number;
  content: string;
}

interface UserCommentsTableProps {
  users: User[];
  posts: Post[];
  UserComments: Comments[];
  deleteUserComment: (id: number) => void;
  editUserComment: (comment: Comments) => void;
}

interface AddUserCommentProps {
  users: User[];
  posts: Post[];
  setComments: React.Dispatch<React.SetStateAction<Comments[]>>;
  isEditing: boolean;
  selectedComment: Comments | null;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedComment: React.Dispatch<
    React.SetStateAction<Comments | null>
  >;
}

// export all types on this file
export type {
  User,
  AddUserProps,
  UserTableProps,
  UserProfile,
  UserProfileTableProps,
  AddUserProfileProps,
  Post,
  AddUserPostProps,
  UserPostTableProps,
  Comments,
  UserCommentsTableProps,
  AddUserCommentProps,
};
