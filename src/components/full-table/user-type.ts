/*
{
  "instance_id": "00000000-0000-0000-0000-000000000000",
  "id": "3d711dc6-beff-4f82-8644-03fb63d94220",
  "aud": "authenticated",
  "role": "authenticated",
  "email": "info@jewishmalta.com",
  "encrypted_password": "$2a$10$RqgECYb/0QU0qdjqJkynduWtpMZnEhj89ueikqtiEmAyTg76T4QIu",
  "email_confirmed_at": "2025-06-08 18:45:59.644515+00",
  "invited_at": null,
  "confirmation_token": "",
  "confirmation_sent_at": null,
  "recovery_token": "",
  "recovery_sent_at": null,
  "email_change_token_new": "",
  "email_change": "",
  "email_change_sent_at": null,
  "last_sign_in_at": "2025-06-09 20:24:43.827363+00",
  "raw_app_meta_data": {
    "provider": "email",
    "providers": [
      "email"
    ]
  },
  "raw_user_meta_data": {
    "user": {
      "email": "info@jewishmalta.com",
      "country": "Asia/Jerusalem",
      "lastName": "חיים שלום",
      "firstName": "סגל"
    },
    "screens": {
      "info": true,
      "users": false,
      "export": false,
      "insert": true,
      "account": false,
      "manager": false,
      "profile": false,
      "calendar": false,
      "inialize": false,
      "settings": false,
      "dashboard": false,
      "templates": false,
      "infocolumns": false,
      "userPermissions": false
    },
    "permissions": [
      {
        "side": "server",
        "label": "מייל",
        "table": "info_students",
        "values": [
          "info@jewishmalta.com"
        ],
        "operator": "and",
        "columnName": "user_id"
      }
    ],
    "info_students": [],
    "email_verified": true
  },
  "is_super_admin": null,
  "created_at": "2025-06-08 18:45:59.632436+00",
  "updated_at": "2025-06-11 10:47:35.226038+00",
  "phone": null,
  "phone_confirmed_at": null,
  "phone_change": "",
  "phone_change_token": "",
  "phone_change_sent_at": null,
  "confirmed_at": "2025-06-08 18:45:59.644515+00",
  "email_change_token_current": "",
  "email_change_confirm_status": 0,
  "banned_until": null,
  "reauthentication_token": "",
  "reauthentication_sent_at": null,
  "is_sso_user": false,
  "deleted_at": null,
  "is_anonymous": false,
  "providers": [
    "email"
  ]
}
*/

export type UserDetails = {
    lastName: string;
    firstName: string;
    email: string;
    country: string;
    [key: string]: string;
}

type UserScreens = {
    info: boolean;
    users: boolean;
    export: boolean;
    insert: boolean;
    account: boolean;
    manager: boolean;
    profile: boolean;
    calendar: boolean;
}

type UserPermissions = {
    side: 'server' | 'client';
    label: string;
    table: 'info_students' | 'info_columns' | 'users';
    values: string[];
    operator: 'and' | 'or';
    columnName: string;
}[]

export type User = {
    user: UserDetails;
    screens: UserScreens;
    permissions: UserPermissions;
}

export type FullUser = {
    id: string;
    email: string;
    raw_user_meta_data: User
}
