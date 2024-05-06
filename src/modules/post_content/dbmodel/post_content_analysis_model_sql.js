'use strict'

module.exports = (sequelize, DataTypes) => {

  
  /**
   * 
    CREATE TABLE media.post_content_analysis (
      record_status INT DEFAULT 1 NULL,
      average_word_length BIGINT NULL,
      no_of_words BIGINT NULL,
      post_id varchar(100) NOT NULL,
      id varchar(100) NOT NULL,
      created_at DATETIME NOT NULL,
      updated_at DATETIME NOT NULL,
      CONSTRAINT post_content_analysis_PK PRIMARY KEY (id),
      CONSTRAINT post_content_analysis_UN UNIQUE KEY (post_id, record_status)
    )
    CREATE INDEX post_content_analysis_post_id_record_status_IDX USING BTREE ON media.post_content_analysis (post_id, record_status);
   */

  const postContentAnalysis = sequelize.define(
    'post_content_analysis',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      postId: {
        type: DataTypes.STRING
      },
      noOfWords: {
        type: DataTypes.INTEGER
      },
      averageWordLength: {
        type: DataTypes.INTEGER
      },
      recordStatus: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      }
    },
    {
      freezeTableName: true
    }
  )

  return postContentAnalysis
}
