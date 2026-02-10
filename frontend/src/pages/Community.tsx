import { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { getUserClustering } from "../apis/community"
import type { CommunityUser } from "../types/community";

export function Community() {
  const [communityUsers, setCommunityUsers] = useState<CommunityUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const authContext = useContext(UserContext)?.contextState;
  const navigation = useNavigate();

  useEffect(() => {
    if (!authContext?.loggedIn) navigation("/login");
    if(authContext?.userRole === "SUPERADMIN"){
	navigation("/admin")
	return
    }
    if (!authContext) return;

    const fetchCommunityUsers = async () => {
      try {
        setIsLoading(true);
        const users = await getUserClustering();
        console.log(users);
        setCommunityUsers(users);
      } catch (error) {
        console.error("Error fetching community users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunityUsers();
  }, [authContext, navigation]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <>
      <div className="bg-gray-50 border-b mt-2 border-gray-300 px-4 py-4">
        <h1 className="text-gray-900 text-lg font-semibold">Community</h1>
        <div className="text-gray-600">Welcome, {authContext?.firstName}</div>
      </div>
      <div className="p-4 max-w-7xl">
        <section>
          <div className="border border-gray-300 rounded">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-300 flex items-center justify-between">
              <div className="text-gray-900 font-medium">Community Members</div>
              <div className="text-gray-600 text-sm">
                {communityUsers.length} members
              </div>
            </div>
            <div className="overflow-x-auto min-h-96 min-w-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-96 w-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                      <th className="px-4 py-2 text-left text-gray-900">
                        Member
                      </th>
                      <th className="px-4 py-2 text-left text-gray-900">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {communityUsers.length > 0 ? (
                      communityUsers.map((user: CommunityUser) => (
                        <tr
                          key={user.id}
                          className="bg-white hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 shrink-0 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                                {user.profile_pic_link ? (
                                  <img
                                    src={user.profile_pic_link}
                                    alt={`${user.first_name} ${user.last_name}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-gray-700 font-medium text-sm">
                                    {getInitials(user.first_name, user.last_name)}
                                  </span>
                                )}
                              </div>
                              <div>
                                <div className="text-gray-900 font-medium">
                                  {user.first_name}{" "}
                                  {user.middle_name ? `${user.middle_name} ` : ""}
                                  {user.last_name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {user.email}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={2}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          No community members found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
