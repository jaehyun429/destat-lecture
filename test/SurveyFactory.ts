import {expect} from "chai";
import {network} from "hardhat";

describe("SurveyFactory Contract", () => {
  let factory, owner, respondent1, respondent2;

  beforeEach(async () => {
    const { ethers } = await network.connect();
    [owner, respondent1, respondent2] = await ethers.getSigners();

    factory = await ethers.deployContract("SurveyFactory", [
      ethers.parseEther("50"), // min_pool_amount
      ethers.parseEther("0.1"), // min_reward_amount
    ]);
  });

  it("should deploy with correct minimum amounts", async () => {
    const { ethers } = await network.connect();
    // TODO: check min_pool_amount and min_reward_amount
    expect(await factory.min_pool_amount()).to.equal(ethers.parseEther("50"));
    expect(await factory.min_reward_amount()).to.equal(ethers.parseEther("0.1"));
  });

  it("should create a new survey when valid values are provided", async () => {
    const { ethers } = await network.connect();
    // TODO: prepare SurveySchema and call createSurvey with msg.value
    const surveySchema = {
      title: "test survey",
      description: "test desc",
      targetNumber: 100,
      questions: [
        {
          question: "question1",
          options: ["a", "b", "c"]
        },
        {
          question: "question2",
          options: ["yes", "no"]
        }
      ]
    };

    const poolAmount = ethers.parseEther("50");
    
    // TODO: check event SurveyCreated emitted
    await expect(factory.createSurvey(surveySchema, { value: poolAmount }))
      .to.emit(factory, "SurveyCreated");
    
    // TODO: check surveys array length increased
    const surveys = await factory.getSurveys();
    expect(surveys.length).to.equal(1);
  });

  it("should revert if pool amount is too small", async () => {
    const { ethers } = await network.connect();
    // TODO: expect revert when msg.value < min_pool_amount
    const surveySchema = {
      title: "test",
      description: "test",
      targetNumber: 100,
      questions: [
        {
          question: "q1",
          options: ["1", "2"]
        }
      ]
    };

    const insufficientAmount = ethers.parseEther("49.9");
    
    await expect(
      factory.createSurvey(surveySchema, { value: insufficientAmount })
    ).to.be.revertedWith("Insufficient pool amount");
  });

  it("should revert if reward amount per respondent is too small", async () => {
    const { ethers } = await network.connect();
    // TODO: expect revert when msg.value / targetNumber < min_reward_amount
    const surveySchema = {
      title: "test",
      description: "test",
      targetNumber: 1000,
      questions: [
        {
          question: "q1",
          options: ["1", "2"]
        }
      ]
    };

    const poolAmount = ethers.parseEther("50"); 
    
    await expect(
      factory.createSurvey(surveySchema, { value: poolAmount })
    ).to.be.revertedWith("Insufficient reward amount ");
  });

  it("should store created surveys and return them from getSurveys", async () => {
    const { ethers } = await network.connect();
    // TODO: create multiple surveys and check getSurveys output
    const surveySchema1 = {
      title: "s1",
      description: "d1",
      targetNumber: 100,
      questions: [
        {
          question: "q1",
          options: ["a", "b"]
        }
      ]
    };

    const surveySchema2 = {
      title: "s2",
      description: "d2",
      targetNumber: 50,
      questions: [
        {
          question: "q2",
          options: ["x", "y"]
        }
      ]
    };

    const surveySchema3 = {
      title: "s3",
      description: "d3",
      targetNumber: 200,
      questions: [
        {
          question: "q3",
          options: ["1", "2", "3"]
        }
      ]
    };

    await factory.createSurvey(surveySchema1, { value: ethers.parseEther("50") });
    await factory.createSurvey(surveySchema2, { value: ethers.parseEther("50") });
    await factory.createSurvey(surveySchema3, { value: ethers.parseEther("50") });

    const surveys = await factory.getSurveys();
    expect(surveys.length).to.equal(3);
    
    for (let i = 0; i < surveys.length; i++) {
      expect(surveys[i]).to.be.properAddress;
    }
  });
});