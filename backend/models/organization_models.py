from pydantic import BaseModel


class OrganizationCreate(BaseModel):
    name: str
    slug: str
    email: str
    phone: str | None = None
    website: str | None = None


class OrganizationSetup(BaseModel):
    organization_name: str
    slug: str
    admin_name: str
    admin_email: str
    admin_password: str