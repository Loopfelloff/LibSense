import { prisma } from "../config/prismaClientConfig.js";
import type{Request , Response} from 'express'
import { v4 as uuid4 } from "uuid";
import { genSaltSync, hashSync } from "bcrypt-ts";
import { getAllUserProfile , getUserProfile} from "../../prisma/vector_embedding/userEmbedding.js";

type preferencesType={
    id : string;
    user_id : string;
    genre_id : string;
}

const createFakeUserData = (firstName: string, lastName: string, hashedPassword: string, roleId: string) => {
  const users = [];
  const userIds: string[] = [];

  for (let i = 0; i < 100; i++) {
    const id = uuid4();
    userIds.push(id);

    users.push({
      id,
      email: `${firstName}{${i}}${lastName}{${i}}@gmail.com`,
      first_name: `${firstName}${i}`,
      last_name: `${lastName}${i}`,
      password: hashedPassword,
      user_role_id: roleId,
    });
  }

  return { users, userIds };
};

const createFakeUserPreferencesData = (userIds: string[], genreIds: string[]) => {
  const preferences:preferencesType[] = [];

  userIds.forEach((userId) => {
    // Shuffle genreIds to pick unique genres
    const shuffledGenres = [...genreIds].sort(() => 0.5 - Math.random());
    // Pick first 5 genres (or less if there are fewer genres)
    const selectedGenres = shuffledGenres.slice(0, Math.min(5, shuffledGenres.length));

    selectedGenres.forEach((genreId) => {
      preferences.push({
        id: uuid4(),
        user_id: userId,
        genre_id: genreId,
      });
    });
  });

  return preferences;
};
const seedUser = async () => {
  try {
    const mockUserFirstName = "mock_user_first";
    const mockUserLastName = "mock_user_last";
    const mockUserPassword = "password123!@#";

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(mockUserPassword, salt);

    const mockUserRoleId = "e2e2f139-dbf3-49ca-8e60-6f50a1083e02";

    // Get all genres
    const genres = await prisma.genre.findMany({
      select: { id: true },
    });
    const genreIds = genres.map((g) => g.id);

    // Generate fake users
    const { users, userIds } = createFakeUserData(mockUserFirstName, mockUserLastName, hashedPassword, mockUserRoleId);

    // Generate fake user preferences
    const userPreferences = createFakeUserPreferencesData(userIds, genreIds);

    // Insert both in a transaction
    await prisma.$transaction([
      prisma.user.createMany({ data: users }),
      prisma.userPreferences.createMany({ data: userPreferences }),
    ]);

    console.log("Seeding complete!");
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.stack);
    }
  }
};

export const seedFakeUserVector = async(req: Request , res:Response)=>{
    try{

	const allUserId = await prisma.user.findMany({
	    select :{
		id : true
	    }
	})

	await Promise.all(allUserId.map(async (userId,index)=>{
	    console.log(index)
	    await getUserProfile(userId.id)
	}))

	console.log("seeding complete")

	return res.json({
	    success : true
	})

    }
    catch(err : unknown){
	if(err instanceof Error){
	    console.log(err.stack)
	}
    }
}


