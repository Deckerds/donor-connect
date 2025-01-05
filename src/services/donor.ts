import axiosClient from "../utils/axiosClient";
import {
  ICreateDonationForm,
  ICreateDonationPayload,
} from "../common/interfaces";

export async function createDonation(data: ICreateDonationPayload) {
  try {
    const res = await axiosClient.post(`/v1/api/donations`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getUserDonations(
  page: number,
  limit: number,
  search: string,
  id: string
) {
  try {
    const res = await axiosClient.get(
      `/v1/api/donations?donorId=${id}&page=${page}&size=${limit}&searchKey=${search}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllDonations(id: string) {
  try {
    const res = await axiosClient.get(`/v1/api/donations?donorId=${id}`);
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

export async function getDonationHistory() {
  try {
    const res = await axiosClient.get(
      `/v1/api/donation-items/upcoming-grouped-by-date`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function addDonation(payload: ICreateDonationForm) {
  try {
    const res = await axiosClient.post(`/v1/api/donations`, payload);
    return res.data;
  } catch (error) {
    throw error;
  }
}
