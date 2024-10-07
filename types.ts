// Users
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
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
  gender: string;
  pronouns: string;
  date_of_birth: string;
  location: string;
  relationship_type: string;
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
  created_at: Date;
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
  created_at: Date;
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

// matches
interface Match {
  id: number;
  user1_id: number;
  user2_id: number;
  matched_at: Date;
}

// follows
interface Follow {
  id: number; // Unique identifier for the follow record
  follower_id: number; // ID of the user who follows another user
  followed_id: number; // ID of the user being followed
  created_at: Date; // Timestamp when the follow occurred
}

interface FollowsTableProps {
  follows: Follow[]; // An array of follow records
  users: User[]; // An array of user records
  deleteFollow: (id: number) => void; // Function to delete a follow record
  editFollow: (follow: Follow) => void; // Function to edit a follow record
}

interface AddFollowsProps {
  users: User[]; // List of users to choose from
  setFollows: React.Dispatch<React.SetStateAction<Follow[]>>; // State setter for follows
  isEditing: boolean; // Flag to indicate if we are in editing mode
  selectedFollow: Follow | null; // Currently selected follow record to edit
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>; // Function to toggle editing mode
  setSelectedFollow: React.Dispatch<
    React.SetStateAction<Follow | null>
  >; // Function to set the selected follow
}

// user images
interface UserImage {
  id: number;
  user_id: number;
  image: string;
}

interface UserImageTableProps {
  users: User[];
  userImages: UserImage[];
  deleteUserImage: (id: number) => void;
}

interface AddUserImageProps {
  users: User[];
  setImages: React.Dispatch<React.SetStateAction<UserImage[]>>;
}

interface Interests {
  id: number;
  category: string;
  label: string;
  value: string;
}

interface User_interests {
  id?: number; // we use a ? because we are unsure what the id is at this point
  user_id: number;
  interest_id: number;
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
  Match,
  Follow,
  FollowsTableProps,
  AddFollowsProps,
  UserImage,
  UserImageTableProps,
  AddUserImageProps,
  Interests,
  User_interests,
};
