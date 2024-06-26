export interface ClientUserData {
    user_id: string,
    username: string,
    first_name: string,
    last_name: string,
    email: string,
    role: string,
    profile_pic: string,
    is_paid: boolean,
    saved_notes_ids: string[],
}