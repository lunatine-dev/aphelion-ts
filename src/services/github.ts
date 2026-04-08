import axios from "axios";

export interface GitHubUser {
    id: number;
    login: string;
    avatar_url: string;
    name: string | null;
    email: string | null;
    [key: string]: any;
}

export const getUser = async (accessToken: string): Promise<GitHubUser> => {
    if (!accessToken) throw new Error("No access token provided");

    const { data } = await axios.get<GitHubUser>(
        "https://api.github.com/user",
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        },
    );

    return data;
};
