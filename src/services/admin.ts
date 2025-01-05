import axiosClient from '../utils/axiosClient';
import { ICreateDonation, SystemUserFormPayload } from '../common/interfaces';

export async function getSystemUsers(
  page: number,
  limit: number,
  search: string,
) {
  try {
    const res = await axiosClient.get(
      `/v1/api/admin/system-users?page=${page}&size=${limit}&searchKey=${search}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function createUser(data: SystemUserFormPayload) {
  try {
    const payload = {
      ...data,
      userRole: {
        id: 1,
        name: 'Administrator',
        code: 'ADMIN',
      },
    };
    const res = await axiosClient.post(`/v1/api/admin/system-users`, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function updateUser(data: SystemUserFormPayload, id: number) {
  try {
    const payload = {
      id,
      ...data,
      userRole: {
        id: 1,
        name: 'Administrator',
        code: 'ADMIN',
      },
    };
    const res = await axiosClient.put(
      `/v1/api/admin/system-users/${id}`,
      payload,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getUser(id: number) {
  try {
    const res = await axiosClient.get(`/v1/api/admin/system-users/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(id: number) {
  try {
    const res = await axiosClient.delete(`/v1/api/admin/system-users/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getDonationTypes() {
  try {
    const res = await axiosClient.get(`/v1/api/admin/donation-item-types`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getDonation(id: number) {
  try {
    const res = await axiosClient.get(
      `/v1/api/admin/donation-item-types/${id}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function createDonation(data: ICreateDonation) {
  try {
    const payload = {
      ...data,
      isActive: true,
    };
    const res = await axiosClient.post(
      `/v1/api/admin/donation-item-types`,
      payload,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function updateDonation(data: ICreateDonation, id: number) {
  try {
    const payload = {
      ...data,
      isActive: true,
    };
    const res = await axiosClient.put(
      `/v1/api/admin/donation-item-types/${id}`,
      payload,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteDonation(id: number) {
  try {
    const res = await axiosClient.delete(
      `/v1/api/admin/donation-item-types/${id}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getDonors(page: number, limit: number, search: string) {
  try {
    const res = await axiosClient.get(
      `/v1/api/admin/donors?page=${page}&size=${limit}&searchKey=${search}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function changeUserStatus(statusPayload: {
  id: number;
  status: boolean;
}) {
  return await axiosClient.patch(
    `/v1/api/admin/donors/${statusPayload.id}/status?isActive=${statusPayload.status}`,
  );
}

export async function getDonations(
  page: number,
  limit: number,
  search: string,
) {
  try {
    const res = await axiosClient.get(
      `/v1/api/admin/donations?page=${page}&size=${limit}&searchKey=${search}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function changeDonationStatus(statusPayload: {
  id: number;
  status: string;
}) {
  return await axiosClient.patch(
    `/v1/api/admin/donations/${statusPayload.id}/status?status=${statusPayload.status}`,
  );
}

export async function downloadPDF(id: number) {
  try {
    const res = await axiosClient.get(`/v1/api/donations/${id}/pdf`, {
      responseType: 'blob',
    });
    return res.data;
  } catch (error) {
    throw error;
  }
}
