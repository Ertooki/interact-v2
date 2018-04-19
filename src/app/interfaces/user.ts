export class User {
  id: number;
  email: string;
  name: string;
  initials: string;
  role: string;
  organizationId: number;

  constructor(id= null, email= '', name= '', initials = '', role= '', organizationId= null) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.initials = initials;
    this.role = role;
    this.organizationId = organizationId;
  }
}
