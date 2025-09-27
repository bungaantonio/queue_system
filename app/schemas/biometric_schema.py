from pydantic import BaseModel


class BiometricCreate(BaseModel):
    template: str
    hash: str
    finger_index: int


class BiometricVerifyRequest(BaseModel):
    user_id: int
    template: str


class BiometricVerifyResponse(BaseModel):
    user_id: int
    verified: bool
    message: str


class BiometricBase(BiometricCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True


class BiometricScanRequest(BaseModel):
    template: str
