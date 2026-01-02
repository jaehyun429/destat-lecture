import { expect } from "chai";
import { keccak256 } from "ethers";
import { network } from "hardhat";

interface Question {
  question: string;
  options: string[];
}

// it("Survey init", async () => {
//     const {ethers} = await network.connect();
//     const title = "막무가내 설문조사";
//     const description = "중앙화된 설문조사로서, 모든 데이터는 공개되지 않으며 설문조사를 게시한자만 볼 수 있습니다.";
//     const questions: Question[] = [
//         {
//             question: "누가 내 응답을 관리할때 더 솔직할 수 있을까요?",
//             options: [
//                 "구글폼 운영자",
//                 "탈중앙화된 블록체인(관리주체 없으며 데이터 공개)",
//                 "상관없음",
//             ],
//         },
//             ];

//     const factory = await ethers.deployContract("SurveyFactory", [
//         ethers.parseEther("50"),
//         ethers.parseEther("0.1")
//     ]);
//     const tx = await factory.createSurvey({
//         title: title,
//         description: description,
//         targetNumber: 100,
//         questions: questions
//     }, {value: ethers.parseEther("100"),

//     },
// );

//     const receipt = await tx.wait();
//     let surveyAddress;
//     receipt?.logs.forEach((log) => {
//         const event = factory.interface.parseLog(log);
//         if (event?.name == "SurveyCreated") {
//             surveyAddress = event.args[0];
//         }
//     });
//     // const surveys = await factory.getSurveys();
//     //const surveyC = await ethers.getContractFactory("Survey");
//     //const survey = await surveyC.attach(surveys[0]);
//     //console.log(survey.getQuestions());
//     const surveyC = await ethers.getContractFactory("Survey");
//     const Signers = await ethers.getSigners();
//     const respondent = Signers[0];

//     if (surveyAddress) {
//     const survey = await surveyC.attach(surveyAddress);
//     await survey.connect(respondent);
//     console.log(ethers.formatEther(await ethers.provider.getBalance(respondent)));
//     const submitTx = await survey.submitAnswer({
//     respondent,
//     answers: [1],
// });
//     }
// console.log(ethers.formatEther(await ethers.provider.getBalance(respondent)));

// });

// it("Survey init", async () => {
//   const { ethers } = await network.connect();
//   const title = "막무가내 설문조사";
//   const description =
//     "중앙화된 설문조사로서, 모든 데이터는 공개되지 않으며 설문조사를 게시한자만 볼 수 있습니다.";
//   const questions: Question[] = [
//     {
//       question: "누가 내 응답을 관리할때 더 솔직할 수 있을까요?",
//       options: [
//         "구글폼 운영자",
//         "탈중앙화된 블록체인(관리주체 없으며 데이터 공개)",
//         "상관없음",
//       ],
//     },
//   ];

//   const survey = await ethers.deployContract(
//     "Survey",
//     [title, description, 100, questions],
//     { value: ethers.parseEther("100") },
//   );

//   const slot0data = await ethers.provider.getStorage(
//     survey.getAddress(),
//     ethers.toBeHex(0, 32),
//   );

//   const slot1data = await ethers.provider.getStorage(
//     survey.getAddress(),
//     ethers.toBeHex(1, 32),
//   );

//   const slot2data = await ethers.provider.getStorage(
//     survey.getAddress(),
//     ethers.toBeHex(2, 32),
//   );

//   const slot3data = await ethers.provider.getStorage(
//     survey.getAddress(),
//     ethers.toBeHex(3, 32),
//   );

//   const slot4data = await ethers.provider.getStorage(
//     survey.getAddress(),
//     ethers.toBeHex(4, 32),
//   );

//   const slot5data = await ethers.provider.getStorage(
//     survey.getAddress(),
//     ethers.toBeHex(5, 32),
//   );

//   const decodeUni = (hex: string) =>
//     Buffer.from(hex.slice(2), "hex").toString("utf-8");

//   //primitive type
//   console.log("primitive types");
//   console.log(slot2data);
//   console.log(slot3data);

//   // long string type
//   console.log("long string type");
//   console.log(slot1data); // 0x103 == 259
//   // pDesc = hash256(Pslot1), getStorage(pDesc))
//   const pDesc = keccak256(ethers.toBeHex(1, 32));
//   const desc = ethers.provider.getStorage(await survey.getAddress(), pDesc);
// });

// 중간과제 시작
describe("Survey init", () => {
  const title = "막무가내 설문조사라면";
  const description =
    "중앙화된 설문조사로서, 모든 데이터는 공개되지 않으며 설문조사를 게시한자만 볼 수 있습니다.";
  const questions: Question[] = [
    {
      question: "누가 내 응답을 관리할때 더 솔직할 수 있을까요?",
      options: [
        "구글폼 운영자",
        "탈중앙화된 블록체인 (관리주체 없으며 모든 데이터 공개)",
        "상관없음",
      ],
    },
  ];

  const getSurveyContractAndEthers = async (survey: {
    title: string;
    description: string;
    targetNumber: number;
    questions: Question[];
  }) => {
    const { ethers } = await network.connect();
    const cSurvey = await ethers.deployContract(
      "Survey",
      [survey.title, survey.description, survey.targetNumber, survey.questions],
      { value: ethers.parseEther("100") }, // 100 ETH를 컨트랙트에 전송
    );
    return { ethers, cSurvey };
  };

  describe("Deployment", () => {
    it("should store survey info correctly", async () => {
      const { cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber: 100,
        questions,
      });

      expect(await cSurvey.title()).to.equal(title);
      expect(await cSurvey.description()).to.equal(description);
      expect(await cSurvey.targetNumber()).to.equal(100);
    });

    it("should calculate rewardAmount correctly", async () => {
      const { ethers, cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber: 100,
        questions,
      });

      const expectedReward = ethers.parseEther("100") / 100n;
      expect(await cSurvey.rewardAmount()).to.equal(expectedReward);
    });
  });

  describe("Questions and Answers", () => {
    it("should return questions correctly", async () => {
      const { cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber: 100,
        questions,
      });

      const returnedQuestions = await cSurvey.getQuestions();
      expect(returnedQuestions.length).to.equal(questions.length);
      expect(returnedQuestions[0].question).to.equal(questions[0].question);
      expect(returnedQuestions[0].options.length).to.equal(
        questions[0].options.length,
      );
      expect(returnedQuestions[0].options[0]).to.equal(questions[0].options[0]);
    });

    it("should allow valid answer submission", async () => {
      const { ethers, cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber: 100,
        questions,
      });

      const signers = await ethers.getSigners();
      const respondent = signers[1];

      await cSurvey.connect(respondent).submitAnswer({
        respondent: respondent.address,
        answers: [1], // 두 번째 옵션 선택
      });

      const answers = await cSurvey.getAnswers();
      expect(answers.length).to.equal(1);
      expect(answers[0].respondent).to.equal(respondent.address);
      expect(answers[0].answers[0]).to.equal(1);
    });

    it("should revert if answer length mismatch", async () => {
      const { ethers, cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber: 100,
        questions,
      });

      const signers = await ethers.getSigners();
      const respondent = signers[1];

      await expect(
        cSurvey.connect(respondent).submitAnswer({
          respondent: respondent.address,
          answers: [1, 2], // 질문은 1개인데 답변은 2개
        }),
      ).to.be.revertedWith("Mismatched answers length");
    });

    it("should revert if target reached", async () => {
      const { ethers, cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber: 2, // 목표를 2명으로 설정
        questions,
      });

      const signers = await ethers.getSigners();

      // 첫 번째 응답자
      await cSurvey.connect(signers[1]).submitAnswer({
        respondent: signers[1].address,
        answers: [0],
      });

      // 두 번째 응답자
      await cSurvey.connect(signers[2]).submitAnswer({
        respondent: signers[2].address,
        answers: [1],
      });

      // 세 번째 응답자는 실패해야 함
      await expect(
        cSurvey.connect(signers[3]).submitAnswer({
          respondent: signers[3].address,
          answers: [2],
        }),
      ).to.be.revertedWith("This survey has been ended");
    });
  });

  describe("Rewards", () => {
    it("should pay correct reward to respondent", async () => {
      const { ethers, cSurvey } = await getSurveyContractAndEthers({
        title,
        description,
        targetNumber: 100,
        questions,
      });

      const signers = await ethers.getSigners();
      const respondent = signers[1];

      const balanceBefore = await ethers.provider.getBalance(
        respondent.address,
      );

      const tx = await cSurvey.connect(respondent).submitAnswer({
        respondent: respondent.address,
        answers: [1],
      });

      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const balanceAfter = await ethers.provider.getBalance(respondent.address);

      const expectedReward = ethers.parseEther("100") / 100n;
      const actualReward = balanceAfter - balanceBefore + gasUsed;

      expect(actualReward).to.equal(expectedReward);
    });
  });
});
// 중간과제 끝
