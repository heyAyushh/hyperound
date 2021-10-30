import { Button, Input, Page, Spacer, useToasts } from "@geist-ui/react";
import { useRouter } from 'next/router';
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { ArrowRightCircle } from '@geist-ui/react-icons'
import { useState } from "react";
import axios from "axios";
import { delay } from "../../lib";
import { useRecoilValue } from "recoil";
import { userState } from "../../store/user";

// got an invite?

export default function Join(): JSX.Element {
  const router = useRouter();
  const [, setToast] = useToasts();
  const [invite, setInvite] = useState('');
  const { username } = useRecoilValue(userState);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND;

  // if isCreator then route to username/creator

  return (
    <div className="page">
      <Header />
      <div className="container p-4">
        <>
          <Spacer h={7} />
          <h1>Got an Invite?</h1>
          <Input
            clearable
            className={`m-2`}
            placeholder="Enter Invite Code here"
            value={invite}
            onClearClick={() => setInvite('')}
            onChange={(event) => {

              if (!event.defaultPrevented) {
                setInvite(event.target.value.toUpperCase())
              }

            }}
          />
          <Button
            type="secondary"
            className="mt-3"
            iconRight={<ArrowRightCircle />}
            disabled={invite.length === 7 ? false : true}
            auto
            scale={3 / 6}
            onClick={
              async (event) => {
                if (!event.defaultPrevented) {
                  try {
                    const inviteRes = await axios.get(`${BACKEND_URL}/invite/${invite}`);

                    const data = inviteRes.data;

                    await delay(5000);
                    router.push(`/${username}/creator`);
                  } catch (e) {

                    if (e.response && e.response.data) {
                      setToast(e.response.data);
                    } else {
                      setToast({
                        text: 'Invite Validation failed!',
                        type: 'error',
                      });
                    }
                  }
                }
              }
            }
          />
        </>
      </div>
      <Footer />
    </div>
  )
}
