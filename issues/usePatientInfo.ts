/**
 * Issue
 *
 * There appears to be number of issues with this hook:
 *
 * 1. The hook is causing performance issues.
 * It is a simple hook but somehow seems to be doing much more
 * than it should.
 *
 * 2. The hook doesn't seem to react properly on changes to input param.
 *
 * 3. We're seeing errors like "Can't perform a React state update on an unmounted component"
 * that somehow seem to be related to this component.
 *
 * Because of the large number of issues, you should check the entire
 * implementation of the hook.
 */
import { useEffect, useState } from "react";
import ServiceFactory from "../src/ServiceFactory";

type UserInfo = { userId: string; name: string };
type MedicalRecord = { userId: string; isSick: boolean };
type PatientInfo = UserInfo & MedicalRecord;

interface UserService {
  getUserInfo(userId: string): Promise<UserInfo>;
}

interface MedicalRecordService {
  getMedicalRecord(userId: string): Promise<MedicalRecord>;
}

interface LoggingService {
  log(action: string, userId: string): void;
}

/**
 * React hook for fetching info about patient
 *
 * This hook also logs access to patient's medical
 * record info.
 */
export default function usePatientInfo(
  userId: string
): PatientInfo | undefined {
  const userService = ServiceFactory.createService<UserService>("userService");
  const medicalRecordService =
    ServiceFactory.createService<MedicalRecordService>("medicalRecordService");

  const [userInfo, setUserInfo] = useState<UserInfo>({ userId, name: "" });
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord>();

  const logAccess = (action: string, userId: string) =>
    ServiceFactory.createService<LoggingService>("logService").log(
      action,
      userId
    );

  useEffect(() => {
    userService.getUserInfo(userInfo.userId).then(setUserInfo);

    logAccess("request-access", userInfo.userId);
    medicalRecordService
      .getMedicalRecord(userInfo.userId)
      .then(setMedicalRecord);
  }, [userService, userInfo]);

  useEffect(() => {
    if (medicalRecord) {
      logAccess("obtain-access", userInfo.userId);
    }
  }, [medicalRecord, userInfo]);

  return medicalRecord ? { ...userInfo, ...medicalRecord } : undefined;
}
